class Workspace {

    constructor(id, workspaceTitle, authId ,color, imageUri,accessCode, members){
        this.id = id;
        this.workspaceTitle = workspaceTitle;
        this.authId = authId
        this.color = color
        this.imageUri = imageUri
        this.accessCode =  accessCode
        this.members = members
    }
} 

export default Workspace