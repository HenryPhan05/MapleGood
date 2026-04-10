const ACCENT = "#E0A800";

export default function SettingsPage() {
  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <h1
        className="text-2xl font-extrabold tracking-tight sm:text-3xl"
        style={{ color: ACCENT }}
      >
        Settings
      </h1>
      <p className="mt-4 text-gray-600">
        Placeholder for system settings. Configure site options, notifications, and
        permissions here when the backend is ready.
      </p>
    </div>
  );
}
