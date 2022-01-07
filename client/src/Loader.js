class Loader {
    async load() {
        if (this._wasm && this._wasm2) return;
        /**
         * @private
         */
        this._wasm = "chrome-extension://pfmcgnplippanalbpckfieahnopgigia/custom_modules/@emurgo/cardano-serialization-lib-browser/cardano_serialization_lib";
    }

    get Cardano() {
        return this._wasm;
    }
}

export default new Loader();