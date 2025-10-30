import { FiUserX, FiTrash2, FiAlertTriangle, FiPause, FiShield } from "react-icons/fi";

const AccountControlsPage = () => {
  return (
    <div className="p-8 space-y-8">
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
          <FiShield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="heading-4 text-foreground">Account Controls</h2>
          <p className="body-text text-secondary-foreground">
            Manage critical account actions and security settings
          </p>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200">
        <div className="flex items-center gap-3">
          <FiAlertTriangle className="w-6 h-6 text-orange-600" />
          <div>
            <h4 className="label-text font-semibold text-orange-800">Important Notice</h4>
            <p className="text-sm text-orange-700 mt-1">
              These actions will affect your account access and data. Please proceed with caution.
            </p>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="space-y-6">
        {/* Deactivate Account */}
        <div className="bg-white/60 backdrop-blur-sm border border-accent-primary/30 rounded-3xl p-8 shadow-lg">
          <div className="flex items-start justify-between gap-8">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center">
                <FiPause className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="heading-5 text-foreground mb-2">Deactivate Account</h3>
                <p className="body-text text-secondary-foreground mb-4">
                  Temporarily disable your account. You can reactivate it anytime by logging back in.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-secondary-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                    <span>Your data will be preserved</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-secondary-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                    <span>Team members will lose access to your shared content</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-secondary-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                    <span>Billing will be paused</span>
                  </div>
                </div>
              </div>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-105">
              <FiUserX className="w-4 h-4" />
              <span className="label-text font-medium">Deactivate Account</span>
            </button>
          </div>
        </div>

        {/* Delete Account */}
        <div className="bg-white/60 backdrop-blur-sm border border-red-200 rounded-3xl p-8 shadow-lg">
          <div className="flex items-start justify-between gap-8">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
                <FiTrash2 className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="heading-5 text-foreground mb-2">Delete Account</h3>
                <p className="body-text text-secondary-foreground mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                    <span>All your data will be permanently deleted</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                    <span>Team access will be immediately revoked</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                    <span>This action cannot be reversed</span>
                  </div>
                </div>
              </div>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-105">
              <FiTrash2 className="w-4 h-4" />
              <span className="label-text font-medium">Delete Account</span>
            </button>
          </div>
        </div>
      </div>

      {/* Additional Security Information */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-accent-primary to-accent-secondary border border-primary/20">
        <div className="flex items-center gap-3">
          <FiShield className="w-5 h-5 text-primary" />
          <div>
            <h4 className="label-text font-semibold text-foreground">Need Help?</h4>
            <p className="text-sm text-secondary-foreground mt-1">
              Contact our support team if you need assistance with account management or have questions about these actions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountControlsPage;
