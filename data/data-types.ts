export type TreeNode = {
    value: number;
    name: string;
    stargazerCount: number;
    url: string;
    forkCount: number;
    children: Tree[];
  };

  export type TreeLeaf = {
    type: 'leaf';
    name: string;
    value: number;
  };

  export type Tree = TreeNode | TreeLeaf;
