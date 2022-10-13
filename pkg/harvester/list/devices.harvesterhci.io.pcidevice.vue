<script>
import { HCI } from '../types';
import { SCHEMA } from '@shell/config/types';
import Banner from '@components/Banner/Banner.vue';
import Loading from '@shell/components/Loading';
import MessageLink from '@shell/components/MessageLink';
import DeviceList from '../edit/kubevirt.io.virtualmachine/VirtualMachinePciDevices/DeviceList';

const schema = {
  id:         HCI.PCI_DEVICE,
  type:       SCHEMA,
  attributes: {
    kind:       HCI.PCI_DEVICE,
    namespaced: true
  },
  metadata: { name: HCI.PCI_DEVICE },
};

export default {
  name: 'ListPciDevicePage',

  components: {
    Banner, DeviceList, Loading, MessageLink
  },

  async fetch() {
    this.hasSchema = this.$store.getters['harvester/schemaFor'](HCI.PCI_DEVICE);

    if (this.hasSchema) {
      try {
        const inStore = this.$store.getters['currentProduct'].inStore;

        this.rows = await this.$store.dispatch(`${ inStore }/findAll`, { type: HCI.PCI_DEVICE });
      } catch (e) {}
    }
  },

  data() {
    return {
      rows: [],
      to:   `${ HCI.ADD_ONS }/harvester-system/pcidevices-controller?mode=edit`
    };
  },

  computed: {
    schema() {
      return schema;
    }
  },

  typeDisplay() {
    return this.$store.getters['type-map/labelFor'](schema, 99);
  }
};
</script>

<template>
  <Loading v-if="$fetchState.pending" />
  <DeviceList v-else-if="hasSchema" :rows="rows" :schema="schema" />
  <div v-else>
    <Banner color="warning">
      <MessageLink
        :to="to"
        prefix-label="harvester.backup.message.noSetting.prefix"
        middle-label="harvester.backup.message.noSetting.middle"
        suffix-label="harvester.backup.message.noSetting.suffix"
      />
    </Banner>
  </div>
</template>
