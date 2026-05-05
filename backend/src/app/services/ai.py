"""AI integration, using groq to be able to generate the content"""

import json
import os
from urllib.parse import quote_plus
from groq import Groq
from app.core.settings import settings

from app.schemas.weeklyPlan import WeeklyPlanCreate
# FIX -> AI SOMETIMES USES ALT SPELLINGS IN QUERUES -> CSHARP VS C#, CAN FIX LATER THROUGH INJECTING TOPIC NAME IN PYTHON
# connecting to the GROQ servers and making a client through the api key in .env
connection = Groq(api_key=settings.groq_api_key)

# this would be the function we use to build the URL off of the search queries, doing this because AI would jsut make random ass URLs that arent real
def buildURL(resource_type: str, query: str) -> str:

    
    temp_query = quote_plus(query)

    # for going to yt since video should most likely go to yt
    if resource_type == "video":
        return f"https://www.youtube.com/results?search_query={temp_query}"
    else:
        return f"https://www.google.com/search?q={temp_query}"

# used to generate the weekly plans
# topic -> string = what user wants to learn
# proficency -> string, level of the user when it comes to the topic
# weeks -> int = number of weeks you wanna ;earn the topic in 
# learning_path_id -> int = ID of learning path for the the plans
# returns WeeklyPlanCreate objects
def generatingWeeklyPlans(topic: str, proficency: str, weeks: int, learning_path_id: int) -> list[WeeklyPlanCreate]:

    # prompt were planning to give the AI
    prompt = f"""Create a {weeks} week learning path for someone at the {proficency} level learning {topic}
    for each week make sure to provide:
    - week_number where the number can only be from 1 to {weeks}
    - goal which would be a list of 2-3 specific goals as strings
    - plan_description, which would be a 1-2 sentence description of what to focus on that week
    - resources, this would be a list of about 3-5 learning resources for the week 

    MAKE SURE the resources have a:
    - resource_type, they have to be EXACTLY one of: "video", "audio", "article", "problems", "course"
    - resource_summary, this would be a description of the resource given, which would be max of 300 characters
    - search_query, make it a short specific search phrase which would be around 4-8 words that someone could paste into youtube or google to find this resource. Each resource within a week MUST have a different search_query.

    RETURN ONLY a JSON array and there should be no extra text and each item in the array should be an object with all the fields stated


    An Example of the format I want it in:
    [
        {{
            "week_number": 1,
            "goal": ["Learn variables", "Understand data types"],
            "plan_description": "Focus on basic Python syntax and storing information.",
            "resources": [
      {{
        "resource_type": "video",
        "resource_summary": "Introduction to Python variables and data types.",
        "search_query": "python variables and data types tutorial"
      }},
      {{
        "resource_type": "article",
        "resource_summary": "A beginner-friendly guide to Python data types.",
        "search_query": "python data type beginner guide"
      }}
    ]
  }}
]
    """

    # send the prompt to groq, its coming from us and we are sending the prompt
    # also setting the model were gonna use from groq where temp also controls the creativity from the chatbot itseld
    response = connection.chat.completions.create(messages = [{"role": "user", "content": prompt}], model="llama-3.3-70b-versatile", temperature = 0.7)

    # pick the first response made from the AI
    ai_response = response.choices[0].message.content

    # convertes the JSON text into a python list of dictionaries
    weekly_plans_data = json.loads(ai_response)

    # hold plans
    saved_plans = []

    # create a new weeklyplan object with both the plan and the resources, convert search query into the actual url we can use later
    for planData in weekly_plans_data:

        # thisll hold the AI response with the plans 
        weeklyPlan = WeeklyPlanCreate(week_number=planData["week_number"], goal=planData["goal"], plan_description=planData["plan_description"], learning_path_id=learning_path_id,)

        # transform the AI resources with a real URL
        raw_resource = planData.get("resources", [])
        transformed_resource = []

        for resource in raw_resource:
            # build search URL based on research type
            url = buildURL(resource["resource_type"], resource["search_query"])

            transformed_resource.append({"resource_type": resource["resource_type"], "resource_summary": resource["resource_summary"], "url": url,})

        # add resources that the ai generated to the weeklyplan 
        saved_plans.append({"plan": weeklyPlan, "resources": transformed_resource})
       

    return saved_plans