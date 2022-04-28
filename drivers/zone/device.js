"use strict";

const { Device } = require("homey");
const ZoneHelper = require("../../lib/Zone");
const Conversions = require( '../../lib/Conversions' );

class HydraWiseDevice extends Device {
  /**
   * onInit is called when the device is initialized.
   */

  async onInit() {
    this.zoneHelper = new ZoneHelper(this.homey);
    this.isChangedByStatusUpdate = false;
    this.registerCapabilityListener("onoff", async (value, options) => {
      if (!this.isChangedByStatusUpdate) {
        await this.zoneHelper.startstopZone(value, options, this);
      }
      this.isChangedByStatusUpdate = false;
    });
  }

  /**
   * onAdded is called when the user adds the device, called just after pairing.
   */
  async onAdded() {
    // this.log('MyDevice has been added');
  }

  /**
   * onSettings is called when the user updates the device's settings.
   * @param {object} event the onSettings event data
   * @param {object} event.oldSettings The old settings object
   * @param {object} event.newSettings The new settings object
   * @param {string[]} event.changedKeys An array of keys changed since the previous version
   * @returns {Promise<string|void>} return a custom message that will be displayed
   */
  async onSettings({ oldSettings, newSettings, changedKeys }) {
    //  this.log('MyDevice settings where changed');
  }

  /**
   * onRenamed is called when the user updates the device's name.
   * This method can be used this to synchronise the name to the device.
   * @param {string} name The new name
   */
  async onRenamed(name) {
    //this.log('MyDevice was renamed');
  }

  /**
   * onDeleted is called when the user deleted the device.
   */
  async onDeleted() {
    this.log("HydrawiseDevice has been deleted");
  }

  // Update the capabilities
  async updateStatus(updatedRelay) {
    const runLength =
      updatedRelay.time === 1 ? updatedRelay.run / 60 : 0;
    this.isChangedByStatusUpdate = true;
    this.setCapabilityValue("meter_remaining_duration", Math.ceil(runLength));
    this.setCapabilityValue("onoff", updatedRelay.runLength > 0);
    this.setCapabilityValue( "meter_time_next_run_duration",
      updatedRelay.time === 1 ? 0 : updatedRelay.run / 60
    );

    const nextrunttime = Conversions.toDaysMinutes( updatedRelay.time )
    this.setCapabilityValue("meter_time_next_run", nextrunttime );
  }

  getRemainingDuration() {
    return this.getCapabilityValue("meter_remaining_duration");
  }

  setZoneOnOff(on) {
    this.isChangedByStatusUpdate = true;
    this.setCapabilityValue("onoff", on);
  }
}

module.exports = HydraWiseDevice;
