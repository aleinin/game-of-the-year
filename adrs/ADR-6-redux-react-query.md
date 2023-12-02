## Date: 12/1/2023

## Problem
* Need to synchronize server state and client state
* Currently, use redux to do this

## Decision
Replace redux with react-query

## Why?
Ultimately the app isn't complicated enough to necessitate a full state machine implementation. Redux is being used as a way to synchronize server and client state.

React-query is better suited for this task out of the box in comparison to redux and offers built-ins that significantly decrease boilerplate and app logic