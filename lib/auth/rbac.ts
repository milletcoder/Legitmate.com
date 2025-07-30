/**
 * Role-Based Access Control (RBAC) System
 * Provides comprehensive permission management and access control
 */

export interface Permission {
  id: string
  name: string
  description: string
  resource: string
  action: string
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: Permission[]
  isSystem: boolean
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  email: string
  roles: Role[]
  permissions: Permission[]
  isActive: boolean
}

export interface UserRole {
  userId: string
  roleId: string
  assignedBy: string
  assignedAt: Date
  expiresAt?: Date
  isActive: boolean
}

export interface AccessContext {
  userId: string
  roles: Role[]
  permissions: Permission[]
  sessionId: string
  ipAddress?: string
  userAgent?: string
}

export interface RBACContext {
  user: User | null
  hasPermission: (resource: string, action: string) => boolean
  hasRole: (roleName: string) => boolean
  canAccess: (requiredPermissions: string[]) => boolean
}

export class RBACService {
  private static readonly SYSTEM_PERMISSIONS: Permission[] = [
    // User Management
    { id: "1", name: "users.create", description: "Create users", resource: "users", action: "create" },
    { id: "2", name: "users.read", description: "View users", resource: "users", action: "read" },
    { id: "3", name: "users.update", description: "Update users", resource: "users", action: "update" },
    { id: "4", name: "users.delete", description: "Delete users", resource: "users", action: "delete" },

    // Document Management
    { id: "5", name: "documents.create", description: "Create documents", resource: "documents", action: "create" },
    { id: "6", name: "documents.read", description: "View documents", resource: "documents", action: "read" },
    { id: "7", name: "documents.update", description: "Update documents", resource: "documents", action: "update" },
    { id: "8", name: "documents.delete", description: "Delete documents", resource: "documents", action: "delete" },
    { id: "9", name: "documents.share", description: "Share documents", resource: "documents", action: "share" },

    // Analytics
    { id: "10", name: "analytics.read", description: "View analytics", resource: "analytics", action: "read" },
    { id: "11", name: "analytics.export", description: "Export analytics", resource: "analytics", action: "export" },

    // Compliance
    { id: "12", name: "compliance.read", description: "View compliance data", resource: "compliance", action: "read" },
    { id: "13", name: "compliance.manage", description: "Manage compliance", resource: "compliance", action: "manage" },

    // Settings
    { id: "14", name: "settings.read", description: "View settings", resource: "settings", action: "read" },
    { id: "15", name: "settings.update", description: "Update settings", resource: "settings", action: "update" },

    // System Administration
    { id: "16", name: "system.admin", description: "System administration", resource: "system", action: "admin" },
    { id: "17", name: "roles.manage", description: "Manage roles", resource: "roles", action: "manage" },
    {
      id: "18",
      name: "permissions.manage",
      description: "Manage permissions",
      resource: "permissions",
      action: "manage",
    },

    // Billing
    { id: "19", name: "billing.read", description: "View billing", resource: "billing", action: "read" },
    { id: "20", name: "billing.manage", description: "Manage billing", resource: "billing", action: "manage" },

    // AI Features
    { id: "21", name: "ai.use", description: "Use AI features", resource: "ai", action: "use" },
    { id: "22", name: "ai.configure", description: "Configure AI settings", resource: "ai", action: "configure" },
  ]

  private static readonly SYSTEM_ROLES: Role[] = [
    {
      id: "1",
      name: "Super Admin",
      description: "Full system access",
      permissions: this.SYSTEM_PERMISSIONS,
      isSystem: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      id: "2",
      name: "Admin",
      description: "Administrative access",
      permissions: this.SYSTEM_PERMISSIONS.filter(
        (p) => !["system.admin", "roles.manage", "permissions.manage"].includes(p.name),
      ),
      isSystem: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      id: "3",
      name: "Manager",
      description: "Management access",
      permissions: this.SYSTEM_PERMISSIONS.filter((p) =>
        [
          "documents.read",
          "documents.create",
          "documents.update",
          "documents.share",
          "analytics.read",
          "compliance.read",
          "compliance.manage",
          "users.read",
          "ai.use",
          "settings.read",
        ].includes(p.name),
      ),
      isSystem: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      id: "4",
      name: "User",
      description: "Standard user access",
      permissions: this.SYSTEM_PERMISSIONS.filter((p) =>
        [
          "documents.read",
          "documents.create",
          "documents.update",
          "compliance.read",
          "ai.use",
          "settings.read",
        ].includes(p.name),
      ),
      isSystem: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      id: "5",
      name: "Viewer",
      description: "Read-only access",
      permissions: this.SYSTEM_PERMISSIONS.filter((p) =>
        ["documents.read", "analytics.read", "compliance.read"].includes(p.name),
      ),
      isSystem: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
  ]

  /**
   * Get all available permissions
   */
  static getAllPermissions(): Permission[] {
    return [...this.SYSTEM_PERMISSIONS]
  }

  /**
   * Get all available roles
   */
  static getAllRoles(): Role[] {
    return [...this.SYSTEM_ROLES]
  }

  /**
   * Get role by ID
   */
  static getRoleById(roleId: string): Role | null {
    return this.SYSTEM_ROLES.find((role) => role.id === roleId) || null
  }

  /**
   * Get role by name
   */
  static getRoleByName(roleName: string): Role | null {
    return this.SYSTEM_ROLES.find((role) => role.name === roleName) || null
  }

  /**
   * Check if user has specific permission
   */
  static hasPermission(user: User, resource: string, action: string): boolean {
    if (!user || !user.isActive) return false

    // Check direct permissions
    const hasDirectPermission = user.permissions.some(
      (permission) => permission.resource === resource && permission.action === action,
    )

    if (hasDirectPermission) return true

    // Check role-based permissions
    const hasRolePermission = user.roles.some((role) =>
      role.permissions.some((permission) => permission.resource === resource && permission.action === action),
    )

    return hasRolePermission
  }

  /**
   * Check if user has specific role
   */
  static hasRole(user: User, roleName: string): boolean {
    if (!user || !user.isActive) return false
    return user.roles.some((role) => role.name === roleName)
  }

  /**
   * Check if user can access resource with required permissions
   */
  static canAccess(user: User, requiredPermissions: string[]): boolean {
    if (!user || !user.isActive) return false

    return requiredPermissions.every((permission) => {
      const [resource, action] = permission.split(".")
      return this.hasPermission(user, resource, action)
    })
  }

  /**
   * Get user's effective permissions (direct + role-based)
   */
  static getUserEffectivePermissions(user: User): Permission[] {
    if (!user || !user.isActive) return []

    const permissions = new Map<string, Permission>()

    // Add direct permissions
    user.permissions.forEach((permission) => {
      permissions.set(permission.id, permission)
    })

    // Add role-based permissions
    user.roles.forEach((role) => {
      role.permissions.forEach((permission) => {
        permissions.set(permission.id, permission)
      })
    })

    return Array.from(permissions.values())
  }

  /**
   * Assign role to user
   */
  static async assignRole(userId: string, roleId: string): Promise<boolean> {
    try {
      // In a real implementation, update database
      console.log(`Assigning role ${roleId} to user ${userId}`)
      return true
    } catch (error) {
      console.error("Error assigning role:", error)
      return false
    }
  }

  /**
   * Remove role from user
   */
  static async removeRole(userId: string, roleId: string): Promise<boolean> {
    try {
      // In a real implementation, update database
      console.log(`Removing role ${roleId} from user ${userId}`)
      return true
    } catch (error) {
      console.error("Error removing role:", error)
      return false
    }
  }

  /**
   * Grant permission to user
   */
  static async grantPermission(userId: string, permissionId: string): Promise<boolean> {
    try {
      // In a real implementation, update database
      console.log(`Granting permission ${permissionId} to user ${userId}`)
      return true
    } catch (error) {
      console.error("Error granting permission:", error)
      return false
    }
  }

  /**
   * Revoke permission from user
   */
  static async revokePermission(userId: string, permissionId: string): Promise<boolean> {
    try {
      // In a real implementation, update database
      console.log(`Revoking permission ${permissionId} from user ${userId}`)
      return true
    } catch (error) {
      console.error("Error revoking permission:", error)
      return false
    }
  }

  /**
   * Create custom role
   */
  static async createRole(roleData: Omit<Role, "id" | "createdAt" | "updatedAt">): Promise<Role | null> {
    try {
      const newRole: Role = {
        ...roleData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // In a real implementation, save to database
      console.log("Creating new role:", newRole)
      return newRole
    } catch (error) {
      console.error("Error creating role:", error)
      return null
    }
  }

  /**
   * Update role
   */
  static async updateRole(roleId: string, updates: Partial<Role>): Promise<boolean> {
    try {
      // In a real implementation, update database
      console.log(`Updating role ${roleId}:`, updates)
      return true
    } catch (error) {
      console.error("Error updating role:", error)
      return false
    }
  }

  /**
   * Delete role
   */
  static async deleteRole(roleId: string): Promise<boolean> {
    try {
      const role = this.getRoleById(roleId)
      if (role?.isSystem) {
        throw new Error("Cannot delete system role")
      }

      // In a real implementation, delete from database
      console.log(`Deleting role ${roleId}`)
      return true
    } catch (error) {
      console.error("Error deleting role:", error)
      return false
    }
  }

  /**
   * Get users with specific role
   */
  static async getUsersByRole(roleId: string): Promise<User[]> {
    try {
      // In a real implementation, query database
      console.log(`Getting users with role ${roleId}`)
      return []
    } catch (error) {
      console.error("Error getting users by role:", error)
      return []
    }
  }

  /**
   * Get role hierarchy (for nested roles)
   */
  static getRoleHierarchy(): { [key: string]: string[] } {
    return {
      "Super Admin": ["Admin", "Manager", "User", "Viewer"],
      Admin: ["Manager", "User", "Viewer"],
      Manager: ["User", "Viewer"],
      User: ["Viewer"],
      Viewer: [],
    }
  }

  /**
   * Check if role inherits from another role
   */
  static roleInheritsFrom(roleName: string, parentRoleName: string): boolean {
    const hierarchy = this.getRoleHierarchy()
    return hierarchy[roleName]?.includes(parentRoleName) || false
  }
}

/**
 * RBAC Hook for React components
 */
export interface RBACContextType {
  context: AccessContext | null
  hasPermission: (resource: string, action: string) => boolean
  hasRole: (roleName: string) => boolean
  canAssignRole: (roleId: string) => boolean
  isLoading: boolean
}

/**
 * Permission decorator for API routes
 */
export function requirePermission(resource: string, action: string) {
  return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value

    descriptor.value = async function (...args: any[]) {
      // Extract context from request (implementation depends on your auth system)
      const context = args[0]?.context as AccessContext

      if (!context) {
        throw new Error("Access context not found")
      }

      const validation = RBACService.validateAccess(context, resource, action)

      if (!validation.allowed) {
        throw new Error(`Access denied: ${validation.reason}`)
      }

      return method.apply(this, args)
    }
  }
}

/**
 * Validate access for resource and action
 */
export function validateAccess(
  context: AccessContext,
  resource: string,
  action: string,
): {
  allowed: boolean
  reason?: string
} {
  // Check if user has the required permission
  if (!RBACService.hasPermission(context.user!, resource, action)) {
    return {
      allowed: false,
      reason: `Missing permission: ${resource}:${action}`,
    }
  }

  // Additional validation logic can be added here
  // e.g., time-based access, IP restrictions, etc.

  return { allowed: true }
}
