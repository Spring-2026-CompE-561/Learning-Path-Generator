"""AI integration, using groq to be able to generate the content"""

import json
import os
from groq import Groq
from app.core.settings import settings

from app.schemas.weeklyPlan import WeeklyPlanCreate

# connecting to the GROQ servers and making a client through the api key in .env
connection = Groq(api_key=settings.groq_api_key)

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
    - url, this would be a real working URL from well-known resources like YouTube, freeCodeCamp, W3Schools, Coursera, Khan Academy etc. MAKE SURE ITS RELIABLE AND NOT FAKE

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
        "url": "https://www.youtube.com/watch?v=example"
      }},
      {{
        "resource_type": "article",
        "resource_summary": "A beginner-friendly guide to Python data types.",
        "url": "https://realpython.com/python-data-types/"
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

    # create a new weeklyplan object with both the plan and the resources
    for planData in weekly_plans_data:

        # thisll hold the AI response with the plans 
        weeklyPlan = WeeklyPlanCreate(week_number=planData["week_number"], goal=planData["goal"], plan_description=planData["plan_description"], learning_path_id=learning_path_id,)

        # add resources that the ai generated to the weeklyplan 
        saved_plans.append({"plan": weeklyPlan, "resources": planData.get("resources", [])})
       

    return saved_plans