This api powers the core of Fanapptic's service.

## Installation

Before install, <a href="https://nodejs.org/en/download/">download and install Node.js</a>. The latest stable version of Node.js is recommended.

Before install, <a href="https://dev.mysql.com/doc/refman/5.7/en/osx-installation-pkg.html">download and install MySQL for OSX</a>. 

```
npm install
```

## Setting up MySQL

Before running the API, you'll need to start MySQL on your machine (Port 3306, which is MySQL's default).

After starting, use your favorite tool for manipulating MySQL databases. Popular tools include <a href="https://dev.mysql.com/downloads/shell/">MySQL Shell</a>, <a href="https://www.phpmyadmin.net/">PHPMyAdmin</a> or <a href="https://www.mysql.com/products/workbench/">MySQL Workbench</a>.

Create a new database called `fanapptic`. It should have the `root` MySQL user assigned to it. The `root` user should not have a password. You may use alternative users, just be sure to change the `MYSQL_USERNAME` and `MYSQL_PASSWORD` fields in the root level `.env` file of the API to match.

## Setting up a basic dataset and testing

The mocha based test suite of the API is setup in a way that it tests the system's integrity while also generating a default dataset within the database.

To run tests, simple use `npm test`.

This will generate a default user with the email `tester@fanapptic.com` and password `testpassword`.
