const AccountControlsPage = () => {
  return (
    <div>
      <div className="space-y-1">
        <h4 className="heading-4">Account Controls</h4>
        <p className="subtitle-text text-secondary-foreground">
          Take critical actions like deactivating or permanently deleting your
          account.
        </p>
      </div>
      <div className="mt-4 space-y-4">
        <div className="border bg-white shadow-lg p-5 rounded-xl flex items-center justify-between">
          <div>
            <h5 className="heading-5">Deactivate Account</h5>
            <p className="subtitle-text text-secondary-foreground">
              Temporarily disable your account — you can reactivate it anytime
              by logging back in.
            </p>
          </div>
          <button className="btn btn-danger">Deactivate Account</button>
        </div>
        <div className="border bg-white shadow-lg p-5 rounded-xl flex items-center justify-between">
          <div>
            <h5 className="heading-5">Delete Account</h5>
            <p className="subtitle-text text-secondary-foreground">
              Permanently delete your account and all associated data — this
              action cannot be undone.
            </p>
          </div>
          <button className="btn btn-danger">Delete Account</button>
        </div>
      </div>
    </div>
  );
};

export default AccountControlsPage;
