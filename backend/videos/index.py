'''
Business: API for video platform - get videos, video details, comments
Args: event with httpMethod, queryStringParameters, pathParams
Returns: JSON response with videos data
'''

import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any
from datetime import datetime

def serialize_datetime(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
        
        params = event.get('queryStringParameters', {}) or {}
        video_id = params.get('id')
        
        if video_id:
            cur.execute('''
                SELECT v.id, v.title, v.description, v.thumbnail_url, v.duration, 
                       v.views_count, v.likes_count, v.user_id,
                       u.username, u.display_name as author, u.avatar_url as author_avatar, u.subscribers_count
                FROM videos v
                JOIN users u ON v.user_id = u.id
                WHERE v.id = %s
            ''', (video_id,))
            video = cur.fetchone()
            
            if not video:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Video not found'}),
                    'isBase64Encoded': False
                }
            
            cur.execute('''
                SELECT c.id, c.video_id, c.user_id, c.text, c.likes_count,
                       u.username, u.display_name as author, u.avatar_url as author_avatar,
                       EXTRACT(EPOCH FROM (NOW() - c.created_at)) as seconds_ago
                FROM comments c
                JOIN users u ON c.user_id = u.id
                WHERE c.video_id = %s
                ORDER BY c.created_at DESC
            ''', (video_id,))
            comments = cur.fetchall()
            
            for comment in comments:
                seconds = comment['seconds_ago']
                if seconds < 3600:
                    comment['time'] = f"{int(seconds / 60)} минут назад"
                elif seconds < 86400:
                    comment['time'] = f"{int(seconds / 3600)} часов назад"
                else:
                    comment['time'] = f"{int(seconds / 86400)} дней назад"
                del comment['seconds_ago']
            
            result = dict(video)
            result['comments'] = [dict(c) for c in comments]
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(result, default=serialize_datetime),
                'isBase64Encoded': False
            }
        else:
            cur.execute('''
                SELECT v.id, v.title, v.description, v.thumbnail_url, v.duration, 
                       v.views_count, v.likes_count, v.user_id,
                       u.username, u.display_name as author, u.avatar_url as author_avatar
                FROM videos v
                JOIN users u ON v.user_id = u.id
                ORDER BY v.views_count DESC
            ''')
            videos = cur.fetchall()
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps([dict(v) for v in videos], default=serialize_datetime),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }