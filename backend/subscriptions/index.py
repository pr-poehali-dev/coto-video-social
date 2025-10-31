'''
Business: API for subscriptions - toggle subscription to channels
Args: event with httpMethod, body containing channel_id and subscriber_id
Returns: JSON response with subscription status
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
        channel_id = body_data.get('channel_id')
        subscriber_id = body_data.get('subscriber_id', 7)
        
        if not channel_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'channel_id required'}),
                'isBase64Encoded': False
            }
        
        conn = psycopg2.connect(database_url)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute('SELECT id FROM subscriptions WHERE subscriber_id = %s AND channel_id = %s', (subscriber_id, channel_id))
        existing_sub = cur.fetchone()
        
        if existing_sub:
            cur.execute('DELETE FROM subscriptions WHERE subscriber_id = %s AND channel_id = %s', (subscriber_id, channel_id))
            cur.execute('UPDATE users SET subscribers_count = subscribers_count - 1 WHERE id = %s', (channel_id,))
            subscribed = False
        else:
            cur.execute('INSERT INTO subscriptions (subscriber_id, channel_id) VALUES (%s, %s)', (subscriber_id, channel_id))
            cur.execute('UPDATE users SET subscribers_count = subscribers_count + 1 WHERE id = %s', (channel_id,))
            subscribed = True
        
        cur.execute('SELECT subscribers_count FROM users WHERE id = %s', (channel_id,))
        result = cur.fetchone()
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'subscribed': subscribed, 'subscribers_count': result['subscribers_count']}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
