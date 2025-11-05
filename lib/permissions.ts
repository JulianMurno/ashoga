import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

const statements = {
  events: ['manage-events', 'view-events'],
  correspondence: ['create', 'view', 'take-decisions']
} as const;

export const ac = createAccessControl(statements)

const secretario = ac.newRole({
  ...defaultStatements,
  events: ['manage-events', 'view-events'],
  correspondence: ['create', 'view']
})

const comisionDirectiva = ac.newRole({
  events: ['view-events'],
  correspondence: ['view', 'take-decisions']
})

const admin = ac.newRole({
  events: ['manage-events', 'view-events'],
  correspondence: ['create', 'view', 'take-decisions'],
  ...adminAc.statements,
})

export const roles = {
  secretario,
  comisionDirectiva,
  admin
}