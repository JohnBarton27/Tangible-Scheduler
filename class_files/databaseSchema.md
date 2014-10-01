Database
=================================

##Users

- _id : objectId 
- firstname : string
- lastname : string
- phone : string
- email : string
- events : array of event Documents	
  * event_object : document 
	  + event_id : objectId
	  + event_date : string
- skills : array
  * skill_name
- role : string

##Projects

- _id : objectId
- name : string
- description : string
- due_date : date
- events : array of event ids	
  + event_id : objectId

##Events

- _id : object_id
- project : object_id, reference to 'project' collection
- name : string
- description : string
- date : date
- skills_needed : array of skills objects	
  + skill : Document
    * skill : string
	* required : string
	* user_id : ObjectId

##Posts

- _id : ObjectId
- subject : string
- body : string
- date_sent : date
- skills : array of skills to send to 
  + skill_name : string
- events : array of documents
  + event : document
    * event_id : objectId
	* event_name : String

