const fs = require('fs');

// read repo level data
let rawRepos = fs.readFileSync('d3-repo-info.json');
let repos = JSON.parse(rawRepos);

// read mode level data
let rawModules = fs.readFileSync('modules.json');
let modules = JSON.parse(rawModules);

// merge
const data = repos.data.repositoryOwner.repositories.nodes.map( repo => {

    const details = modules.filter( module => module.repo === repo.name)
    console.log('---')
    console.log(details)

    return({
        name: repo.name,
        url: repo.url,
        description: repo.description,
        forkCount: repo.forkCount,
        stargazerCount: repo.stargazerCount,
        issueCount: repo.issues.totalCount,
        functions: details[0]?.items
    })
})

fs.writeFile('./data.json', JSON.stringify(data), err => {
    if (err) {
      console.error(err);
    }
})













// const query = `
// query d3repos {
//     repositoryOwner(login: "d3") {
//       repositories(first: 100) {
//         pageInfo {
//           hasNextPage
//           endCursor
//         }
//         totalCount
//         nodes {
//           name
//           url
//           description
//           descriptionHTML
//           forkCount
//           stargazerCount
//           issues(first: 100) {
//             pageInfo {
//               hasNextPage
//               endCursor
//             }
//             totalCount
//           }
//         }
//       }
//     }
//   }
// `


// fetch('https://api.github.com/graphql', {
//     method: 'post',
//     body: JSON.stringify({ query }),
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     }).then((res) => console.log(res))
