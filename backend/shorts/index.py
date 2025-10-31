'''
Business: API for shorts videos - get vertical short-form videos
Args: event with httpMethod, queryStringParameters
Returns: JSON response with shorts data
'''

import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    
    try:
        conn = psycopg2.connect(database_url)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute('''
            SELECT v.id, v.title, v.description, v.thumbnail_url, v.duration, 
                   v.views_count, v.likes_count, v.user_id, v.video_type, v.aspect_ratio,
                   u.username, u.display_name as author, u.avatar_url as author_avatar
            FROM videos v
            JOIN users u ON v.user_id = u.id
            WHERE v.video_type = 'short'
            ORDER BY v.views_count DESC
        ''')
        shorts = cur.fetchall()
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps([dict(s) for s in shorts]),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
