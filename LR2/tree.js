class Node {
    constructor(obj, parent = null, pDir = null) {
        this.x = obj.x;
        this.y = obj.y;
        this.left = null;
        this.top = null;
        this.right = null;
        this.bottom = null;
        this.parent = parent;
        this.pDir = pDir;
        this.wayL = parent?parent.wayL+1:0;
    }
}

class SearchTree {
    constructor(maze) {
        this.root = new Node(maze[0][0]);
        this.maze = maze;
        this.aim = null;
    }

    init(node){
        if(!this.maze[node.y][node.x].left&&node.pDir!=='left'){
            node.left= new Node(this.maze[node.y][node.x-1], node, 'right')
        }
        if(!this.maze[node.y][node.x].top&&node.pDir!=='top'){
            node.top=  new Node(this.maze[node.y-1][node.x], node, 'bottom')
        }
        if(!this.maze[node.y][node.x].right&&node.pDir!=='right'){
            node.right=  new Node(this.maze[node.y][node.x+1], node, 'left')
        }
        if(!this.maze[node.y][node.x].bottom&&node.pDir!=='bottom'){
            node.bottom=  new Node(this.maze[node.y+1][node.x], node, 'top')
        }
    }

    moveFull(node, callback) {
        if (node != null) {
            if(callback(node)){
                this.aim = node
                return true
            }
            return this.moveFull(node.left, callback) || this.moveFull(node.top, callback) || this.moveFull(node.right, callback) || this.moveFull(node.bottom, callback);
        }
    }
}

module.exports = {SearchTree, Node}