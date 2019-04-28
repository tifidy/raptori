const path = require('path')

exports.createPages = ({ actions, graphql }) => {
	const { createPage } = actions

	const blogPostTemplate = path.resolve(`src/templates/post.js`)
	const blogListTemplate = path.resolve(`src/templates/blog.js`)

	return graphql(`
		{
			allMarkdownRemark(
				sort: { order: DESC, fields: [frontmatter___date] }
				limit: 1000
			) {
				edges {
					node {
						frontmatter {
							path
						}
					}
				}
			}
		}
	`).then(result => {
		if (result.errors) {
			return Promise.reject(result.errors)
		}

		const posts = result.data.allMarkdownRemark.edges
		const postsPerPage = 20
		const pageCount = Math.ceil(posts.length / postsPerPage)

		posts.forEach(({ node }) => {
			createPage({
				path: node.frontmatter.path,
				component: blogPostTemplate,
			})
		})

		Array.from({ length: pageCount }).forEach((_, i) => {
			createPage({
				path: i === 0 ? '/blog' : `/blog/${i}`,
				component: blogListTemplate,
				context: {
					limit: postsPerPage,
					skip: i * postsPerPage,
					pageCount,
					currentPage: i + 1,
				},
			})
		})
	})
}
