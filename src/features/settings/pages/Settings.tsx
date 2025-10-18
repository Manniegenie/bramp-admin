import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Bell,
  Palette,
  Globe,
  Database,
} from 'lucide-react';

export function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <div className="grid gap-6">
        {/* Notifications Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-sm text-gray-500">Receive email updates</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Push Notifications</h3>
                <p className="text-sm text-gray-500">Receive push notifications</p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>

        {/* Display Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Palette className="w-5 h-5 mr-2" />
            Display
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Dark Mode</h3>
                <p className="text-sm text-gray-500">Toggle dark mode theme</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Compact View</h3>
                <p className="text-sm text-gray-500">Enable compact layout</p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>

        {/* Regional Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Regional
          </h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Language</label>
              <select aria-label="Language" className="w-full p-2 border rounded-md">
                <option>English (US)</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time Zone</label>
              <select aria-label="Time Zone" className="w-full p-2 border rounded-md">
                <option>UTC (GMT+0)</option>
                <option>EST (GMT-5)</option>
                <option>PST (GMT-8)</option>
              </select>
            </div>
          </div>
        </Card>

        {/* System Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Database className="w-5 h-5 mr-2" />
            System
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Automatic Updates</h3>
                <p className="text-sm text-gray-500">Keep system up to date</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Data Collection</h3>
                <p className="text-sm text-gray-500">Help improve our services</p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}