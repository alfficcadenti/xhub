opxhub-ui Jenkins Configuration files

The files within this directory contain the Jenkins configuration used to create
the Jenkins build jobs for opxhub-ui when it was created.

Modifying these files will not update your Jenkins build jobs.  You need to apply
the changes to the job on the Jenkins server - either via the UI or importing the
updated configuration.

If you make changes on the Jenkins server via the UI, those changes are not reflected
here.  It is your responsibility to update these files if you want.


| Filename | Details |
| --- | --- |
| jenkins-all.xml | Jenkins build job for non master branches, named: "opxhub-ui-all" |
| jenkins-master.xml | Jenkins build job for the master branch, named: "opxhub-ui-master" |
