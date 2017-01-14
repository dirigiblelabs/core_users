# core_users

A service for managing user profiles on top of web container's user identities.

Dirigible applications rely on the underlying web container's security mehanisms for authentication and authorization of users. 
Often the user identities management is delegated to dedicated IdP solutions. The primary purpose of any of these is to ensure identities and access control and provides limited additional information about the user that is normally (too) generic.
The user identity however can be, and normally is, extended by or associated with a profile that comprises application specific properties.

This service acts like a proxy to the underlying identity management mechanism that composes on the fly the user identity together with appliciaton specific properties.

In this first version, it simply adds a user picture (avatar) to a user identity and uses the user name as association link between them.

Angular directives for regular tasks related to users (e.g. displaying an avatar image on page) and examples for using the service can be found in the WebContent folder of the project.
