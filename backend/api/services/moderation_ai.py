from openai import OpenAI
from django.conf import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

def ai_moderate(text: str, logger) -> bool:
    response = client.moderations.create(
        model='omni-moderation-latest', 
        input=text
    )
    logger.info("response", response)
    logger.info("response.results", response.results)
    logger.info("response.results[0]", response.results[0])
    result = response.results[0]
    return result.flagged 


