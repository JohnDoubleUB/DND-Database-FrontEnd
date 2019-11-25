# DND Character Sheet Application -

This was created as part of my individual project to demonstrate my newly gained skills during training at QA

## Index
[Brief](#brief)
   * [Solution](#solution)

[Architecture](#architecture)
   * [Entity Relationship Diagram](#erd)
   * [Multi Tier Architecture Diagram](#mtad)

[Testing](#testing)
   * [Reports](#reports)

[Deployment](#deployment)
   * [Technologies Used](#techused)
   * [Deploying This Project](#deployingproject)

[Front End Design](#frontend)
   * [Plan 1](#fep1)
   * [Plan 2](#fep2)
   * [Final Appearence](#fefa)

[Future Improvments](#improvements)

<a name="brief"></a>
## The Brief
To create an OOP-based application making use of supporting tools, methodolgies and technologies that demonstrate all of the core modules covered over the training period.
The application must manipulate two tables with full CRUD functionality.
<a name="solution"></a>
### Solution
For my project I decided to create an application that would allow the user to create dnd characters, edit, view and remove them from a database, there would be separate databases for certain details of the characters such as the race and class.
<a name="architecture"></a>
## Architecture
<a name="erd"></a>
### Entity Relationship Diagrams
#### Initial plan
Though in my initial plan I intended to create a number of tables for different aspects of DnD characters; Classes, Races etc as noted on my trello, I only managed to create two tables with some relational aspects as shown in the diagram below

#### Delivered Solution
![Final ERD](Documentation/RelationshipDiagramQaProject.jpg)

<a name="mtad"></a>
### Multi Tier Architecture Diagram
Click for higher res version
![MTA](/Documentation/DndDatabaseBackendArchitectureDiagram3.jpg)

Aswell as using Models, Repositories Services and Controllers to structure my project, I have also used Dto's (Data Transfer Objects), While this isn't entirely necessary in this project, it is safer to control access in this way as it means that the only time that direct interaction with the repository entity takes place is when something in the database is being changed.

#### OOP

The backend was written in Java making use of the Springboot API and H2 as my database of choice, I did everything I could to ensure a good structure to my backend code and used interfaces where I could in order to help force a particular structure to my code via abstraction, I also used polymorphism in the form of overloading which was extremely useful while doing my mockito junit tests as well as turning my inventory objects into inventoryDtos for sending as responses to http requests.

Encapsulaton was used in order to control how I was interacting with my variables within the inventory and playercharacter objects as well as their dto's and was used in a number of other places.

Given the structure of my api I didn't make use of alot of inheritence however I did inherit JpaRepository for both of my repositories as this class simplifies the data access process for both relational and non-relational databases

<a name="testing"></a>
## Testing
JUnit, Mockito and Selenium tests were used for automated testing, Codacy was used to check code quality throughout the project for both the front and backend.

<a name="reports"></a>
### Reports

#### The coverage of the API using mockito junit tests can be seen here:
![JUnit Mockito Coverage](/Documentation/backendcoverage.jpg)

#### You can also see the surefire reports here:
[Surefire Report for AppControllerServiceSuite](/Documentation/surefire-report-AppControllerServiceSuite.pdf)   
[Surefire Report for SeleniumSuite](/Documentation/surefire-report-SeleniumSuite.pdf)   

Note: These were converted from html to pdf for easier reading on the repository, the html files are also available in documentation.

#### Codacy
[Front End Project Quality](https://app.codacy.com/manual/JohnDoubleUB/QASoloProject/dashboard?bid=14198592)   
[Backend End Project Quality](https://app.codacy.com/manual/JohnDoubleUB/dnddatabase/dashboard?bid=14198594)

## Video of Testing and CI Server
I have put together a video to also demonstrate all my tests running both locally and on gcp.   
https://www.youtube.com/watch?v=xeLE-XXkWaQ&feature=youtu.be   
This also includes a demo of my CI Server and how it automatically checks and pulls changes from both my repos to make a smooth CI pipeline.

<a name="deployment"></a>
## Deployment
The build test, deployment and selenium tests were all automated through the use of jenkins with the backend this was done through the use of a jenkins file and with the front end this was done with a normal jenkins job. This application can be succesfully deployed both locally and on GCP, there is a globals.js file which contains constants for changing the location of the http requests 
![Deployment Pipeline](/Documentation/ContinuousIntegrationPipelineProj.jpg)

<a name="techused"></a>
### Technologies Used

* H2 Database Engine - Database
* Java - Logic
* Front-end - HTML, CSS, JavaScript
* Backend API - Spring-Boot
* Jenkins - CI Server
* Maven - Dependency Management
* Surefire - Test Reporting
* Codacy - Code Quality Checking
* Git - VCS [Project Front End](https://github.com/JohnDoubleUB/QASoloProject), [Project Back End](https://github.com/JohnDoubleUB/dnddatabase)
* [Trello](https://trello.com/b/DnaqB0v8/individual-project-dnd-database) - Project Tracking
* GCP - Live Environment

<a name="deployingproject"></a>
### Deploying this project
#### Backend

[Project Back End](https://github.com/JohnDoubleUB/dnddatabase)   

In order to deploy this project in its entirety on GCP all you will need is to ensure that you have Docker, Docker-Compose, Jenkins, Apache2 and the Chromium Browser installed, ideally on Ubuntu 18.04.3 LTS as this is the distro I was using for this project. (Doing a google search on these things should come up with guides for these things if you are unsure)

You must also ensure that permissions have been given to Jenkins both to use Docker and Apache2's /var/www/html folder. An issue I encountered when trying to get Jenkins to use Docker as a user without sudo was that Docker requires users who use its commands to have their home directories inside of /home. I solved this by moving his home directory and setting JENKINS_HOME enviroment varable to point at a jenkins home inside of /home. I'm sure there are other ways to fix this issue, but if in doubt  my solution did do the trick (You can find videos of how to move Jenkins' home that can help you do this if you are unsure).   

Alternatively you could just give jenkins sudo permissions and then change the jenkinsfile to have sudo before all the docker commands, this would be quicker, but its generally a better idea to limit the privilages that users get in order to prevent intentional or accidental sabotage.

[Project Front End](https://github.com/JohnDoubleUB/QASoloProject)   

#### Frontend

Other than the Apache2 installed on GCP, the video demoing my testing and CI pipeline shows the settings I have for my builds, simpley replicate these and the project should operate like mine.


<a name="frontend"></a>
## Front End Design
### Wireframes
<a name="fep1"></a>
### Plan 1 Wireframe (One Page)
![Plan1Wireframe](/Documentation/DNDPagePlanv2.jpg)
#### Plan 1 - Outline
The plan here would be to have all the interaction on a single page using the fields to both display information of a given character, edit and delete it by using the top most dropdown to either select an existing or new character. The user might also need to write in a characters name to verify that they wanted to delete it (as on one page like this it would be easier for it to be done accidentally)
<a name="fep2"></a>
### Plan 2 Wireframe (2 Page)
#### Create and Edit Page
![Plan2Wireframe1](/Documentation/DNDPagePlanAlternate1_Create_Edit.jpg)
#### View and Delete Page (Possibility 1)
![Plan2Wireframe2](/Documentation/DNDPagePlanAlternate1_View_Delete.jpg)
#### Plan 2 - Outline
The plan here would be to maintain the ability to edit existing and create new on the first page, but then break out the viewing and deleting into a separate page so to make this more separated. The second page has been marked Possiblity 1 as the other possiblity is instead having a similar layout to the create and edit page where the dropdown just shows uneditable information in a similar layout

<a name="fefa"></a>
### Final Appearance
#### Home Page
![homepagefinal](/Documentation/FinalFrontendAppearence/homepage.jpg)
#### Create/Edit Character Page
![createeditcharacterpage](/Documentation/FinalFrontendAppearence/createeditcharacterpage.jpg)
#### Create/Edit Inventory Page
![createeditinventorypage](/Documentation/FinalFrontendAppearence/createeditinventorypage.jpg)
#### View/Delete Character Page
![viewdeletecharacterpage](/Documentation/FinalFrontendAppearence/viewdeletecharacterspage.jpg)
#### View/Delete Inventory Page
![viewdeleteinventoriespage](/Documentation/FinalFrontendAppearence/viewdeleteinventoriespage.jpg)


<a name="improvements"></a>
## Future Improvements
While everything is working currently, there are future improvements that I would like to make in this project. These are primarily, experimenting more with bootstrap to make the site look more attractive, Clean up the front end code further and add more databases and relationships in order to provide a more full experience for the creation of DnD characters. This would also include some of the non essential user stories which were deliberately missed out in order to achieve full functionality of the main parts of the project.
