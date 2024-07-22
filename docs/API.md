# Planner API Documentation

This document provides details on how to interact with the back-end services of the Planner application. The API allows you to manage trips, participants, activities, and links within the application. Below you'll find information on the available endpoints, their purposes, and how to use them.

## Overview

- **Title**: Planner
- **Description**: API specifications for Planner back-end
- **Version**: 1.0.0

## Table of Contents

1. [Trips](#trips)
   - [Create a New Trip](#create-a-new-trip)
   - [Get Trip Details](#get-trip-details)
   - [Update a Trip](#update-a-trip)
   - [Confirm a Trip](#confirm-a-trip)
   - [Get Trip Participants](#get-trip-participants)
   - [Invite to Trip](#invite-to-trip)
2. [Participants](#participants)
   - [Confirm Participant](#confirm-participant)
3. [Activities](#activities)
   - [Create Activity](#create-activity)
   - [Get Activities](#get-activities)
4. [Links](#links)
   - [Create Link](#create-link)
   - [Get Links](#get-links)

---

## Trips

### Create a New Trip

- **Endpoint**: `/trips`
- **Method**: `POST`
- **Description**: Create a new trip.
- **Request Body**:
  ```json
  {
  	"destination": "string",
  	"starts_at": "string (date-time)",
  	"ends_at": "string (date-time)",
  	"emails_to_invite": ["string (email)"],
  	"owner_name": "string",
  	"owner_email": "string (email)"
  }
  ```
- **Response**:
  - **201**: Trip created successfully.
  - **400**: Bad request.

### Get Trip Details

- **Endpoint**: `/trips/{tripId}`
- **Method**: `GET`
- **Description**: Get details of a specific trip.
- **Parameters**:
  - `tripId`: UUID of the trip.
- **Response**:
  - **200**: Trip details retrieved successfully.
  - **400**: Bad request.

### Update a Trip

- **Endpoint**: `/trips/{tripId}`
- **Method**: `PUT`
- **Description**: Update details of a specific trip.
- **Parameters**:
  - `tripId`: UUID of the trip.
- **Request Body**:
  ```json
  {
  	"destination": "string",
  	"starts_at": "string (date-time)",
  	"ends_at": "string (date-time)"
  }
  ```
- **Response**:
  - **204**: Trip updated successfully.
  - **400**: Bad request.

### Confirm a Trip

- **Endpoint**: `/trips/{tripId}/confirm`
- **Method**: `GET`
- **Description**: Confirm a trip and send email invitations.
- **Parameters**:
  - `tripId`: UUID of the trip.
- **Response**:
  - **204**: Trip confirmed and emails sent.
  - **400**: Bad request.

### Get Trip Participants

- **Endpoint**: `/trips/{tripId}/participants`
- **Method**: `GET`
- **Description**: Get participants of a specific trip.
- **Parameters**:
  - `tripId`: UUID of the trip.
- **Response**:
  - **200**: Participants retrieved successfully.
  - **400**: Bad request.

### Invite to Trip

- **Endpoint**: `/trips/{tripId}/invites`
- **Method**: `POST`
- **Description**: Invite someone to the trip.
- **Parameters**:
  - `tripId`: UUID of the trip.
- **Request Body**:
  ```json
  {
  	"email": "string (email)"
  }
  ```
- **Response**:
  - **201**: Invitation sent successfully.
  - **400**: Bad request.

## Participants

### Confirm Participant

- **Endpoint**: `/participants/{participantId}/confirm`
- **Method**: `PATCH`
- **Description**: Confirm a participant on a trip.
- **Parameters**:
  - `participantId`: UUID of the participant.
- **Response**:
  - **204**: Participant confirmed successfully.
  - **400**: Bad request.

## Activities

### Create Activity

- **Endpoint**: `/trips/{tripId}/activities`
- **Method**: `POST`
- **Description**: Create a new activity for a trip.
- **Parameters**:
  - `tripId`: UUID of the trip.
- **Request Body**:
  ```json
  {
  	"occurs_at": "string (date-time)",
  	"title": "string"
  }
  ```
- **Response**:
  - **201**: Activity created successfully.
  - **400**: Bad request.

### Get Activities

- **Endpoint**: `/trips/{tripId}/activities`
- **Method**: `GET`
- **Description**: Get activities of a trip.
- **Parameters**:
  - `tripId`: UUID of the trip.
- **Response**:
  - **200**: Activities retrieved successfully.
  - **400**: Bad request.

## Links

### Create Link

- **Endpoint**: `/trips/{tripId}/links`
- **Method**: `POST`
- **Description**: Create a new link for a trip.
- **Parameters**:
  - `tripId`: UUID of the trip.
- **Request Body**:
  ```json
  {
  	"title": "string",
  	"url": "string (uri)"
  }
  ```
- **Response**:
  - **201**: Link created successfully.
  - **400**: Bad request.

### Get Links

- **Endpoint**: `/trips/{tripId}/links`
- **Method**: `GET`
- **Description**: Get links of a trip.
- **Parameters**:
  - `tripId`: UUID of the trip.
- **Response**:
  - **200**: Links retrieved successfully.
  - **400**: Bad request.
