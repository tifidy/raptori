import React from 'react'
import { graphql } from 'gatsby'

import { Layout, PostLink, SEO } from 'src/components'

const BlogPage = ({
	data: {
		allMarkdownRemark: { edges },
	},
}) => (
	<Layout>
		<SEO title="Blog" />
		<h1>Latest Posts</h1>
		{edges.map(edge => (
			<PostLink key={edge.node.id} post={edge.node} />
		))}
	</Layout>
)

export default BlogPage

export const pageQuery = graphql`
	query($skip: Int!, $limit: Int!) {
		allMarkdownRemark(
			sort: { order: DESC, fields: [frontmatter___date] }
			limit: $limit
			skip: $skip
		) {
			edges {
				node {
					id
					excerpt(pruneLength: 250)
					frontmatter {
						date(formatString: "MMMM DD, YYYY")
						path
						title
					}
					fields {
						readingTime {
							text
						}
					}
				}
			}
		}
	}
`