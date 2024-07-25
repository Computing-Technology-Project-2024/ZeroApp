## How to start
- Create your branch first, please don't make change directly to the main branch.
- Make pull request after your work. Drop a dm to Thang cause he might forget that you made a pr.

## Naming convention
- For python projects (application, data_access), please use PEP 8 convention.
- For Javascript projects, please use camelCase for folders and files name.

# ZeroApp - Backend

Add documentation for your backend contribution here. Please update as soon as possible so the team can be on the same page.

## Initial Setup
Create a virtual environment of your choice (Im using venv, please update your in .gitignore) and install dependencies using: 
> pip install -r requirements.txt


To run the server using uvicorn, run this command in the root directory of the project:
> uvicorn application.main:app --reload

## Backend structure
Use public_api as the root directory of the project.

    |---public_api
        |--- data_access
            |--- models
            |--- repositories
        |--- routers
        |--- schemas
        |--- services
        |--- utils
        |--- __init__.py
        |--- main.py
### data_access
This package contains **sqlalchemy** ORM models for database and repos to query them from the database. \
Sqlalchemy documentation: https://www.sqlalchemy.org/

### routers
This package publish the system API endpoints, mapping from our **services**.

### schemas
This package contains **pydantic** object schemas, which helps with data validation and mapping for our API endpoints. \
Pydantic documentation: https://docs.pydantic.dev/latest/

### services
This is where most of our logic, data analytics stuff happen. We create functions that can be used for the API endpoints here.

### utils
Place any functions that you think might be helpful and reusable here

