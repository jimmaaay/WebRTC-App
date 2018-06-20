# WebRTC Chat App

A simple WebRTC Chat App, which currently allows text chat between two people without a constant server connection.

## Commands

`npm start` - Runs a local dev server

## How It Works

The two parties either create or join a `room`. They then follow the instructions on screen which will involve the users sending each other their connection details that are generated. When connected they'll be able to chat to each other.

## Notes

If you load the page with the query string `?emulateConnection` this will open the app in a `fake` connected mode. This then opens the chat window up which will respond to the chat with the string reversed.