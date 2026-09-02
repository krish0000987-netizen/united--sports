import { Card, Table, THead, TBody, TR, TH, TD, Badge, EmptyState } from "@/components/ui/admin"
import { PageHeader } from "@/components/admin/PageHeader"
import { getActivityLogs } from "@/lib/cms/admin-actions"
import { formatDistanceToNow, formatDate } from "@/lib/format"

export const dynamic = "force-dynamic"

const VARIANT_BY_ACTION: Record<string, "success" | "danger" | "info" | "warning" | "default"> = {
  create: "success",
  create_and_publish: "success",
  publish: "success",
  update: "info",
  delete: "danger",
  reorder: "default",
}

export default async function ActivityLogsPage() {
  const logs = await getActivityLogs({ limit: 200 })

  return (
    <div className="max-w-7xl">
      <PageHeader
        title="Activity Logs"
        description="Audit trail of admin actions across the CMS."
      />

      <Card>
        {logs.length === 0 ? (
          <EmptyState
            title="No activity yet"
            description="Admin actions will be recorded here as they happen."
          />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Admin</TH>
                <TH>Action</TH>
                <TH>Entity</TH>
                <TH>Description</TH>
                <TH>When</TH>
              </TR>
            </THead>
            <TBody>
              {logs.map((log) => (
                <TR key={log.id}>
                  <TD className="text-xs">{log.admin_email || "—"}</TD>
                  <TD>
                    <Badge variant={VARIANT_BY_ACTION[log.action] || "default"}>
                      {log.action}
                    </Badge>
                  </TD>
                  <TD className="text-xs">
                    <span className="font-medium">{log.entity_type}</span>
                  </TD>
                  <TD className="text-xs text-slate-700 line-clamp-1">{log.description || "—"}</TD>
                  <TD className="text-xs text-slate-500" title={formatDate(log.created_at, "datetime")}>
                    {formatDistanceToNow(log.created_at)}
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </Card>
    </div>
  )
}