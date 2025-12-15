from .supabase_client import supabase
from backend.settings import POSTS_MEDIA_BUCKET_NAME
import mimetypes

def upload_post_file_to_supabase(file, filename_with_path):
    res = supabase.storage.from_(POSTS_MEDIA_BUCKET_NAME).upload(file=file, filename=filename_with_path)
    url = supabase.storage.from_(POSTS_MEDIA_BUCKET_NAME).get_public_url(filename_with_path)
    return url

def get_file_type(filename):
    mime_type, _ = mimetypes.guess_type(filename)
    if mime_type:
        if mime_type.startswith('image'):
            return "image"
        elif mime_type.startswith('video'):
            return "video"
        elif mime_type == 'application/pdf':
            return "pdf"
    return "unknown"

def extract_text_from_json(json):
    text = []
    
    def walk(n):
        if isinstance(n, dict):
            if n.get('type') == 'text':
                text.append(n.get('text', ''))
            for child in n.get('content', []):
                walk(child)
        elif isinstance(n, list):
            for item in n:
                walk(item)
    
    walk(json)
    
    return " ".join(text)