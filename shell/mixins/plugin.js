export default {
  methods: {
    load(name, url) {
      if (!name) {
        const parts = url.split('/');
        const n = parts[parts.length - 1];

        name = n.split('.')[0];
      }
      console.log('----name', name, url);
      this.$plugin.loadAsync(name, url).then(() => {
        // this.closeAddDialog();
        this.$store.dispatch('growl/success', {
          title:   `Loaded plugin ${ name }`,
          message: `Plugin was loaded successfully`,
          timeout: 3000,
        }, { root: true });
      }).catch((error) => {
        // this.closeAddDialog();
        const message = typeof error === 'object' ? 'Could not load code' : error;

        console.log('----error', error);
        this.$store.dispatch('growl/error', {
          title:   'Error loading plugin',
          message,
          timeout: 5000
        }, { root: true });
      });
    },

    async install(plugin) {
      // Might need to download the package first
      if (plugin.download) {
        await this.$store.dispatch('rancher/request', { url: plugin.download }, { root: true });
      }

      const name = `${ plugin.name }-${ plugin.version }`;
      let moduleUrl = `/pkg/${ name }/${ name }.umd.min.js`;

      if (plugin.location) {
        moduleUrl = `${ plugin.location }/${ name }/${ name }.umd.min.js`;
      }

      this.load(name, moduleUrl);
    },

    uninstall(plugin) {
      this.$plugin.removePlugin(plugin.name);
    }
  }
};
