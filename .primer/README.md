Kumo App Configuration
======================

Files in this folder are used to specify configuration options that Kumo will use when deploying and managing your app. 

These files include:
- **metadata.json** : metadata for your app (changes are parsed and stored in Kumo's metadata store).
- **notifications.json** : e-mail and Slack notification subscriptions for your app (changes are handled by *Unified Notifications*).
- **deploy.json** : specifies properties of the stack that is deployed for your app, including load balancer and autoscaling options, SSL certificates, and base AMI, among others.
- **iam.json** : specifies policies to be granted to the role under which your app will run when deployed.
- **pipeline.json** : specifies CI/CD steps to be performed when a commit is made to your repo (changes are handled by *Banzai*)
- **cloudformation** : 
  - template/cloudformation.yml : cutomized cloudformation template that Aerosol service will execute
  - config/config.json : configurations for your cloudformation tempate (providing cft parameters and tags)
  - Aerosol documentation: https://confluence.expedia.biz/display/PIP/Kumo+CloudFormation+Deployments+Using+Aerosol#KumoCloudFormationDeploymentsUsingAerosol-UploadingtemplatestoArtifactory
- **firewall.json** : specifies downstream dependencies for your app which require whitelisting and firewall configuration (changes are handled by *BrickMason*)
- **infrastructure.json** *(deprecated: used for the legacy EWE Shared environments and no longer supported)*
- **deployment.json** *(deprecated: used for the legacy EWE Shared environments and no longer supported)*

**Configuration File Validation**
- When changes are made to files in this folder, a pre-receive hook on your repo will perform a shallow validation on these files before allowing the commit. A deeper validation can be enabled by turning on the Kumo Validator - tap the wrench menu in Kumo Console and tick the box for the Kumo Validator webhook, then click "Update Webhooks." Kumo Validator is then enabled as a PR check on your Master branch. You can also validate any branch in your repo in realtime, also from the wrench menu.

**Configuration File Parsing**
- When a commit changes one or more of the files in this folder, a service called OCPCM (*Our Cloud Platform Configuration Manager*) will send the changed file(s) to the appropriate endpoints for validation, parsing, and processing. 

**Documentation**
- https://confluence.expedia.biz/display/BCP/Kumo+Configuration+File+Documentation 

**For more information**
- Post questions in the #kumo-communitysupport Slack channel or on https://go/ask


