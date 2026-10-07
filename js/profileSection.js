//------------ ProfileSection---------------------
class ProfileSection {
    constructor(name, introduction) {
        this.name = name;
        this.introduction = introduction;
    }

    render() {
        const section = document.createElement("section");

        section.innerHTML = `
        <h1>${this.name}</h1>
        <p>${this.introduction}</p>
        `;

        return section;
    }
}



  export { ProfileSection };