'''
Business: API for comments - post new comments to videos
Args: event with httpMethod, body containing video_id, user_id, text
Returns: JSON response with created comment
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
        text = body_data.get('text', '').strip()
        
        if not video_id or not text:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'video_id and text required'}),
                'isBase64Encoded': False
            }
        
        conn = psycopg2.connect(database_url)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute('''
            INSERT INTO comments (video_id, user_id, text)
            VALUES (%s, %s, %s)
            RETURNING id
        ''', (video_id, user_id, text))
        
        comment_id = cur.fetchone()['id']
        
        cur.execute('''
            SELECT c.id, c.video_id, c.user_id, c.text, c.likes_count,
                   u.username, u.display_name as author, u.avatar_url as author_avatar,
                   'только что' as time
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.id = %s
        ''', (comment_id,))
        
        comment = cur.fetchone()
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(dict(comment)),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
