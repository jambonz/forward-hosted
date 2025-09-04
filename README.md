# call-forward-hosted

This application was created with the [create jambonz command](https://www.npmjs.com/package/create-jambonz-app).  This documentation was generated at the time when the project was generated and describes the functionality that was initially scaffolded.  Of course, you should feel free to modify or replace this documentation as you build out your own logic.

## Endpoints

Based on the options that you have chosen, this application exposes the following HTTP endpoints:


### /
Returns a dial verb to forward the call to the carrier specified in the carrier param of the app env.
Optionally if the callerId app env is set it will use this vaule for callerId otherwise the from of the incomming call is used



