import { Plus } from "lucide-react"

import { EntityFormDialog } from "@/components/admin/entity-form-dialog"
import { MenuItemRow } from "@/components/admin/menu-item-row"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createMenuItem } from "@/lib/actions/admin/menus"
import { createClient } from "@/lib/supabase/server"

export default async function AdminMenusPage() {
  const supabase = await createClient()
  const { data: menus } = await supabase.from("margaret_menus").select("id, name, slug").order("name")
  const { data: items } = await supabase
    .from("margaret_menu_items")
    .select("id, menu_id, label, url, status, sort_order")
    .order("sort_order", { ascending: true })

  const menuList = menus ?? []
  const itemsByMenu = new Map<string, typeof items>()
  for (const item of items ?? []) {
    itemsByMenu.set(item.menu_id, [...(itemsByMenu.get(item.menu_id) ?? []), item])
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Menus</h1>
        <p className="text-muted-foreground">Manage the links shown in the site header and footer.</p>
      </div>

      {menuList.length === 0 ? (
        <p className="text-muted-foreground">No menus found.</p>
      ) : (
        <Tabs defaultValue={menuList[0].id}>
          <TabsList>
            {menuList.map((menu) => (
              <TabsTrigger key={menu.id} value={menu.id}>
                {menu.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {menuList.map((menu) => {
            const menuItems = itemsByMenu.get(menu.id) ?? []
            return (
              <TabsContent key={menu.id} value={menu.id} className="pt-6">
                <div className="mb-4 flex justify-end">
                  <EntityFormDialog
                    trigger={
                      <Button size="sm">
                        <Plus className="size-4" aria-hidden="true" /> New Item
                      </Button>
                    }
                    title={`New item in ${menu.name}`}
                    fields={[
                      { name: "label", label: "Label", required: true },
                      { name: "url", label: "URL", required: true, defaultValue: "/" },
                      {
                        name: "status",
                        label: "Status",
                        type: "select",
                        options: [
                          { value: "active", label: "Active" },
                          { value: "inactive", label: "Inactive" },
                        ],
                        defaultValue: "active",
                      },
                    ]}
                    action={createMenuItem}
                    hiddenFields={{ menu_id: menu.id }}
                  />
                </div>

                <div className="overflow-x-auto rounded-xl border bg-background">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Label</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {menuItems.map((item, i) => (
                        <MenuItemRow
                          key={item.id}
                          id={item.id}
                          menuId={item.menu_id}
                          label={item.label}
                          url={item.url ?? ""}
                          status={item.status}
                          isFirst={i === 0}
                          isLast={i === menuItems.length - 1}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            )
          })}
        </Tabs>
      )}
    </div>
  )
}
