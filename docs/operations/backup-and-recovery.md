# Backup and Recovery Notes

**Status:** Synthetic example

## Configured settings
The Terraform sample configures a seven-day database backup retention period.

## Operational requirements
A real service should define:
- Recovery Point Objective (RPO).
- Recovery Time Objective (RTO).
- Backup encryption and access controls.
- Restore-test frequency and recorded outcomes.
- Ownership, escalation, and post-restore validation.

## Evidence limitation
A retention setting in infrastructure code does not prove backups are succeeding or that restoration has been tested. ClaimTrail should not draft an unqualified claim such as “restores are tested regularly” from this file alone.
