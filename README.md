# PlannerBot

Discord Bot to assist server users in organizing dates and times to play games together.

## Purpose

To help organize server events and activities with friends. Will use a calendar like system to give a visual view of upcoming events and allow for users to create and plan events. The user will present a planned event on the server and users will "sign-up" for the events with reactions.

A secondary goal could be to add some accountability to server members by adding some incentive to not be late or only sign-up if they know they will be able to attend, etc., of course accounting for unforeseen events that may cause their absence as well.

## Tasks

* Create a calendar
* Add event to calendar
* Add event name, description, time, and text/voice channel it will be held in
* Create list of users attending based off of reactions
* Show events for current day
* Show events for future days
* Set reminders for events, `@` -ing users who signed up for it
* Delete/cancel event
* Modify/change event name, description, or text/voice channel
* Postpone event

## Components

Frontend - User typing in commands to the bot.

Web Server - Raspberry Pi running the bot. Here the commands will be received and processed, and requests to the database will be made as needed.

Database -  MySQL database running on the Raspberry Pi.

### Sources

[DiscordJS](https://discordjs.guide/#before-you-begin)


### Docs

[DiscordJS](https://discord.js.org/#/docs/main/stable/general/welcome)
[Discord](https://discord.com/developers/docs/intro)