# MetraView Configuration

## Overview
MetraView services and apps utilize externalized configuration files hosted via Spring Cloud Configuration Server.  This approach enables convenient, environment-specific, and hierarchically structured application configuration.

## Prerequisites
To use the encryption and decryption features you need the full-strength JCE installed in your JVM (it’s not there by default). You can download the "Java Cryptography Extension (JCE) Unlimited Strength Jurisdiction Policy Files" from Oracle, and follow instructions for installation.

## Install JCE
Download and install Java Cryptography Extension (JCE) Unlimited Strength Jurisdiction Policy Files
from [here](http://www.oracle.com/technetwork/java/javase/downloads/jce8-download-2133166.html). Replace the 2 policy files in the JRE lib/security directory with the ones that you downloaded.

## Configuration files
Externalized configuration files can be stored in the git repo, or file system local to the Config Server [https://github.com/MetraTech/METRAVIEW-CONFIG](https://github.com/MetraTech/METRAVIEW-CONFIG).  It is prefered to store the configuration files in the git repo for added security and audit tracking.

### File naming convention
Config Server supports hierarchical configuration structure where base configuration for all applications using configuration repository is stored in **application.yml** file.  Application-specific configuration is stored separately in **{application-name}.yml** file.  Where **application-name** is configured in bootstrap.yml included in the application resources as:
***spring.application.name***

**Example:**

METRAVIEW-API service has its application name defined as:
***spring.application.name: metraview-api*** and consequently its default configuration file is named ***metraview-api.yml***

### Spring Profile based configuration
Configuration Server provides support for environment-specific configuration using active application profile.  Best way to specify application profile at runtime is by the command line parameter ***--spring.profiles.active*** i.e. --spring.profiles.active=**default**, where **default** is the name of active application profile.  Environment-specific configuration file would then be names accordingly as **{application-name-profile}.yml**

In addition, application profiles can be combined by specifying multiple active profiles on the command line i.e. 

``--spring.profiles.active=dev,ssl``


**Example**

METRAVIEW-API service has its base application-specific configuration file named ***metraview-api.yml*** which can be overwritten partially of fully when running with **--spring.profiles.active=dev** runtime switch in configuration file named ***metraview-api-dev.yml*** 

The configuration hierarchy stack for an application running with **dev** profile in the order of precedence would look like this:

- ***metraview-api-dev.yml***
- ***metraview-api.yml***
- ***application-dev.yml***
- ***application.yml***

As illustrated in this example both application-specific and base application config files can have environment-specific overrides.


### Encryption of secrets
More to come...

##Running Config Server
In Command Prompt or Terminal, run this command:

```sh
java -jar build/libs/ecb-config-svc-0.1.0.jar --server.port=8888 --encrypt.key=clusterfobia --spring.cloud.config.server.git.username={id} --spring.cloud.config.server.git.password={pwd}
```

where,
- **...git.username** is your github user id
- **...git.password** is your github user password
- **encrypt.key** must match encryption key used to encrypt secrets stored in the git configuration repo.  Currently it is "clusterfobia", but should be changed in production deployments.

In order to override default location of the config files you need to include this command line parameter:
```sh
  --spring.cloud.config.server.git.uri=https://github.com/MetraTech/MARKS-REPO
```

##Running app with externalized configuration
In Command Prompt or Terminal, run this command:

```sh
java -jar build/libs/*.jar --spring.profiles.active=default --spring.cloud.config.uri=http://localhost:8888
```

