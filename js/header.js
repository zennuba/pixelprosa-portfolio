class Header {
    constructor(logo, nav) {
        this.logo = logo;
        this.nav = nav;
    }
    render() {
        const header = document.createElement("header");

        header.innerHTML = `
            <a href=""><img class="logo" src="${this.logo}" alt="logo"></a>${this.nav}
        `;
        return header;
    }
}