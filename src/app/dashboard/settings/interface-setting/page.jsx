const InterfaceSettingsPage = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h4 className="heading-4">Interface Settings</h4>
        <p className="subtitle-text text-secondary-foreground">
          Customize how the dashboard looks and behaves for your experience.
        </p>
      </div>
      <div className="space-y-4">
        {/* Time Zone */}
        <div className="space-y-2">
          <label className="subtitle-text font-semibold block">
            Time zone:
          </label>
          <select className="w-full p-4 border rounded-xl outline-none bg-slate-50">
            <option>GMT+5:30 (India Standard Time)</option>
            <option>GMT+0:00 (UTC)</option>
            <option>GMT-5:00 (Eastern Standard Time)</option>
          </select>
        </div>
        {/* Region */}
        <div className="space-y-2">
          <label className="subtitle-text font-semibold block">Region</label>
          <select className="w-full p-4 border rounded-xl outline-none bg-slate-50">
            <option>Asia / India</option>
            <option>Europe / Germany</option>
            <option>America / USA</option>
          </select>
        </div>
        {/* Language */}
        <div className="space-y-2">
          <label className="subtitle-text font-semibold block">Language</label>
          <select className="w-full p-4 border rounded-xl outline-none bg-slate-50">
            <option>English (US)</option>
            <option>Hindi</option>
            <option>Spanish</option>
          </select>
        </div>
        {/* Currency */}
        <div className="space-y-2">
          <label className="subtitle-text font-semibold block">Currency</label>
          <select className="w-full p-4 border rounded-xl outline-none bg-slate-50">
            <option>USD $</option>
            <option>INR ₹</option>
            <option>EUR €</option>
          </select>
        </div>
      </div>
      <div className="space-x-4">
        <button type="submit" className="primary-btn px-8">
          Save Changes
        </button>
        <button type="button" className="secondary-btn px-8">
          Cancel
        </button>
      </div>
    </div>
  );
};
export default InterfaceSettingsPage;
