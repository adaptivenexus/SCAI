"use client";

const SecurityPrivacyPage = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="heading-4">Security & Privacy</h4>
        <p className="subtitle-text text-secondary-foreground">
          Control login settings, privacy preferences, and account protection
          tools.
        </p>
      </div>
      <form
        onSubmit={() => {}}
        className="w-full p-6 bg-white shadow-lg space-y-6 rounded-xl border"
      >
        <div className="space-y-2">
          <label htmlFor="currentPassword" className="block subtitle-text">
            Current Password
          </label>
          <input
            type="password"
            name="currentPassword"
            id="currentPassword"
            className="py-3 px-2 rounded-xl bg-slate-100 w-full outline-none border disabled:opacity-70"
            placeholder="Enter your current password"
          />
        </div>
        <div className="flex gap-4">
          <div className="space-y-2 flex-1">
            <label htmlFor="newPassword" className="block subtitle-text">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              className="py-3 px-2 rounded-xl bg-slate-100 w-full outline-none border disabled:opacity-70"
              placeholder="Enter your new password"
            />
          </div>
          <div className="space-y-2 flex-1">
            <label htmlFor="confirmPassword" className="block subtitle-text">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              className="py-3 px-2 rounded-xl bg-slate-100 w-full outline-none border disabled:opacity-70"
              placeholder="Re-enter your new password"
            />
          </div>
        </div>
        <div className="space-x-4">
          <button type="button" className="secondary-btn px-8">
            Reset
          </button>
          <button type="submit" className="primary-btn px-8">
            Submit
          </button>
        </div>
      </form>
      <div className="p-6 bg-white shadow-lg rounded-xl border flex items-center justify-between">
        <div className="space-y-2">
          <h5 className="heading-5">Two-Factor Authentication</h5>
          <p className="body-text text-secondary-foreground">
            Add an extra layer of security to your account by enabling
            two-factor authentication.
          </p>
        </div>
        <div className="flex gap-4">
          <button type="button" className="secondary-btn px-8">
            Enable
          </button>
          {false && (
            <button type="button" className="primary-btn px-8">
              Disable
            </button>
          )}
        </div>
      </div>
      <div className="p-6 bg-white shadow-lg rounded-xl border">
        <h5 className="heading-5">Login Activity</h5>
        <table className="w-full">
          <thead className="border-b">
            <tr className="text-left">
              <th className="heading-5 py-4">Location</th>
              <th className="heading-5 py-4">Device</th>
              <th className="heading-5 py-4">Date/Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            <tr className="py-4">
              <td className="body-text text-secondary-foreground py-4">
                New York, USA
              </td>
              <td className="body-text text-secondary-foreground py-4">
                Chrome (Windows)
              </td>
              <td className="body-text text-secondary-foreground py-4">
                Apr 6, 2023, 10:30 AM
              </td>
            </tr>
            <tr className="py-4">
              <td className="body-text text-secondary-foreground py-4">
                London, UK
              </td>
              <td className="body-text text-secondary-foreground py-4">
                Safari (Mac)
              </td>
              <td className="body-text text-secondary-foreground py-4">
                Apr 5, 2023, 2:15 PM
              </td>
            </tr>
            <tr className="py-4">
              <td className="body-text text-secondary-foreground py-4">
                Tokyo, Japan
              </td>
              <td className="body-text text-secondary-foreground py-4">
                Firefox (Linux)
              </td>
              <td className="body-text text-secondary-foreground py-4">
                Apr 4, 2023, 8:45 AM
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default SecurityPrivacyPage;
