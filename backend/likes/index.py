'''
Business: API for likes - toggle like on videos
Args: event with httpMethod, body containing video_id and user_id
Returns: JSON response with like status
'''

import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        video_id = body_data.get('video_id')
        user_id = body_data.get('user_id', 7)
        
        if not video_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'video_id required'}),
                'isBase64Encoded': False
            }
        
        conn = psycopg2.connect(database_url)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute('SELECT id FROM video_likes WHERE video_id = %s AND user_id = %s', (video_id, user_id))
        existing_like = cur.fetchone()
        
        if existing_like:
            cur.execute('DELETE FROM video_likes WHERE video_id = %s AND user_id = %s', (video_id, user_id))
            cur.execute('UPDATE videos SET likes_count = likes_count - 1 WHERE id = %s', (video_id,))
            liked = False
        else:
            cur.execute('INSERT INTO video_likes (video_id, user_id) VALUES (%s, %s)', (video_id, user_id))
            cur.execute('UPDATE videos SET likes_count = likes_count + 1 WHERE id = %s', (video_id,))
            liked = True
        
        cur.execute('SELECT likes_count FROM videos WHERE id = %s', (video_id,))
        result = cur.fetchone()
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'liked': liked, 'likes_count': result['likes_count']}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
