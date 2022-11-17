export type TreeNode = {
    type?: 'node';
    value: number;
    name: string;
    stargazerCount: number;
    children: Tree[];
  };

  export type TreeLeaf = {
    type: 'leaf';
    name: string;
    value: number;
  };

  export type Tree = TreeNode | TreeLeaf;
