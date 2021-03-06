## Tag postgresql-10-rhel7:1-47 from RedHad image repo to tools project
## The image fix defect used to initialize database properly
## Zeva uses this image to create extension hstore and others
oc tag registry.access.redhat.com/rhscl/postgresql-10-rhel7:1-47 tbiwaq-tools/postgresql:10-1-47

## use up-to-date python image as 20200228
oc tag registry.access.redhat.com/rhscl/python-36-rhel7:1-63 tbiwaq-tools/python:3.6-1-63

## create configmap to initialize database properly
oc process -f zeva-postgresql-init.yaml | oc apply -f - -n tbiwaq-dev --dry-run=true
oc process -f zeva-postgresql-init.yaml | oc apply -f - -n tbiwaq-test --dry-run=true
oc process -f zeva-postgresql-init.yaml | oc apply -f - -n tbiwaq-prod --dry-run=true

oc process -f configmap.yaml ENV_NAME=dev SSO_NAME=sso-dev KEYCLOAK_REALM=rzh2zkjq | oc apply -f - -n tbiwaq-dev --dry-run=true

## Create secretes for rabbitmq

## create secrets for keycloak
## find the value for KEYCLOAK_SA_CLIENT_SECRET from keycloak consol
oc process -f keycloak-secret.yaml KEYCLOAK_SA_CLIENT_SECRET= clientId= clientSecret= zevaPublic= realmId= ssoHost= | oc create -f - -n tbiwaq-dev --dry-run=true

## do not use oc apply otherwise secrets could be overrided when rerun the command
oc process -f secrets.yaml | oc create -f - -n tbiwaq-dev --dry-run=true


## apply nfs storage through Openshift service catalog

