Database
=================================

Users
=================================

- _id : number
- firstname : string
- lastname : string
- phone : string
- email : string
- events : array of event Documents	
  * event_object : document 
	  + event_id : number
	  + event_date : string
- skills : array
  * skill_name
- role : string

Projects
================================

- _id : number
- name : string
- description : string
- due_date : date
- events : array of event ids	
  + event_id : number

Events
================================

- _id : number
- project_id
- name : string
- description : string
- date : date
- skills_needed : array of skills objects	
  + skill : Document
    * skill : string
	* required : string
	* user_id : string

Posts
================================

- _id : number
- subject : string
- body : string
- date_sent : date
- skills : array of skills to send to 
  + skill_name : string
- events : array of documents
  + event : document
    * event_id
	* event_name

