"""
Vision Lab backend Lambda handler - Placeholder
Simple hello endpoint for Phase 1.5 infrastructure setup.
"""
import json
from typing import Dict, Any


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Lambda entry point - Simple hello endpoint.
    
    Args:
        event: Lambda event from API Gateway
        context: Lambda context
        
    Returns:
        Lambda response with statusCode, headers, body
    """
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        },
        'body': json.dumps({
            'message': 'Hello from Vision Lab backend!',
            'status': 'ok',
        }),
    }

