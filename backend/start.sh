#!/bin/bash
sudo systemctl start mongod
nodemon src/app.ts
