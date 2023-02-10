import { clone } from '@shell/utils/object';
import { HCI } from '../../types';
import HarvesterResource from '@pkg/harvester/models/harvester';
import { PRODUCT_NAME as HARVESTER_PRODUCT } from '../../config/harvester';
import Vue from 'vue';
import { HCI as HCI_LABELS_ANNOTATIONS } from '@shell/config/labels-annotations';
export default class HarvesterNetworkAttachmentDef extends HarvesterResource {
  get listLocation() {
    return this.$rootGetters['type-map/optionsFor'](this.type).customRoute || {
      name:   `${ HARVESTER_PRODUCT }-c-cluster-resource`,
      params: {
        product:  HARVESTER_PRODUCT,
        cluster:  this.$rootGetters['clusterId'],
        resource: this.type,
      },
    };
  }

  get doneRoute() {
    return this.listLocation.name;
  }

  get detailLocation() {
    const detailLocation = clone(this._detailLocation);

    detailLocation.params.resource = HCI.NETWORK_ATTACHMENT;
    detailLocation.name = `${ HARVESTER_PRODUCT }-c-cluster-resource-namespace-id`;

    return detailLocation;
  }

  get doneOverride() {
    const detailLocation = clone(this._detailLocation);

    delete detailLocation.params.namespace;
    delete detailLocation.params.id;
    detailLocation.params.resource = HCI.NETWORK_ATTACHMENT;
    detailLocation.name = `${ HARVESTER_PRODUCT }-c-cluster-resource`;

    return detailLocation;
  }

  get parentNameOverride() {
    return this.$rootGetters['i18n/t'](`typeLabel."${ HCI.NETWORK_ATTACHMENT }"`, { count: 1 })?.trim();
  }

  get parentLocationOverride() {
    return this.doneOverride;
  }

  get _availableActions() {
    let out = super._availableActions;

    const toFilter = ['goToClone', 'cloneYaml', 'goToViewConfig', 'goToEditYaml'];

    out = out.filter((action) => {
      if (!toFilter.includes(action.action)) {
        return action;
      }
    });

    return out;
  }

  applyDefaults() {
    const spec = this.spec || {
      config: JSON.stringify({
        cniVersion:  '0.3.1',
        name:        '',
        type:        'bridge',
        bridge:      '',
        promiscMode: true,
        vlan:        '',
        ipam:        {}
      })
    };

    Vue.set(this, 'spec', spec);
  }

  get parseConfig() {
    try {
      return JSON.parse(this.spec.config) || {};
    } catch (err) {
      return {};
    }
  }

  get isIpamStatic() {
    return this.parseConfig.ipam?.type === 'static';
  }

  get clusterNetwork() {
    return this?.metadata?.labels?.[HCI_LABELS_ANNOTATIONS.CLUSTER_NETWORK];
  }

  get vlanType() {
    const labels = this.metadata?.labels || {};
    const type = labels[HCI_LABELS_ANNOTATIONS.NETWORK_TYPE];

    return type;
  }

  get vlanId() {
    return this.vlanType === 'UntaggedNetwork' ? 'N/A' : this.parseConfig.vlan;
  }

  get customValidationRules() {
    const rules = [
      {
        nullable:       false,
        path:           'metadata.name',
        required:       true,
        minLength:      1,
        maxLength:      63,
        translationKey: 'harvester.fields.name'
      }
    ];

    return rules;
  }

  get connectivity() {
    const annotations = this.metadata?.annotations || {};
    const route = annotations[HCI_LABELS_ANNOTATIONS.NETWORK_ROUTE];
    let config = {};

    if (this.vlanType === 'UntaggedNetwork') {
      return 'N/A';
    }

    try {
      config = JSON.parse(route || '{}');
    } catch {
      return 'invalid';
    }

    const connectivity = config.connectivity;

    if (connectivity === 'false') {
      return 'inactive';
    } else if (connectivity === 'true') {
      return 'active';
    } else {
      return connectivity;
    }
  }

  get inStore() {
    return this.$rootGetters['currentProduct'].inStore;
  }

  get clusterNetworkResource() {
    const clusterNetworks = this.$rootGetters[`${ this.inStore }/all`](HCI.CLUSTER_NETWORK);

    return clusterNetworks.find(c => c.id === this.clusterNetwork) || {}
  }

  get clusterNetworkErrorMessage() {
    const { error, message } = this.clusterNetworkResource?.metadata?.state || {}

    return error ? message : '' 
  }
}
