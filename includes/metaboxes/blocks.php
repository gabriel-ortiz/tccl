<?php
namespace CCL\MetaBoxes\Blocks;

/**
 * Metaboxes that appear on more than one post type around the site
 *
 * @return void
 */
function setup() {
	$n = function ( $function ) {
		return __NAMESPACE__ . "\\$function";
	};

	// NOTE: Uncomment to activate metabox
	add_action( 'cmb2_init',  $n( 'content_blocks' ) );
}

/**
 * Custom Contenct Blocks metabox
 * See https://github.com/WebDevStudios/CMB2/wiki/Field-Types for
 * more information on creating metaboxes and field types.
 */
function content_blocks() {

	$prefix = 'blocks_';

	$cmb = new_cmb2_box( array(
		'id'           => $prefix . 'metabox',
		'title'        => __( 'Custom Blocks', 'cmb2' ),
		'priority'     => 'high',
		'object_types' => array( 'page' )
	) );

	$block_group_id = $cmb->add_field( array(
		'id'          => $prefix . 'group',
		'type'        => 'group',
		// 'description' => __( 'Generates reusable form entries', 'cmb2' ),
		// 'repeatable'  => false, // use false if you want non-repeatable group
		'options'     => array(
			'group_title'   => __( 'Block {#}', 'cmb2' ), // since version 1.1.4, {#} gets replaced by row number
			'add_button'    => __( 'Add Another Block', 'cmb2' ),
			'remove_button' => __( 'Remove Block', 'cmb2' ),
			'sortable'      => true, // beta
			'closed'     => true, // true to have the groups closed by default
		),
	) );

	$cmb->add_group_field( $block_group_id, array(
		'name'             => 'Block Type',
		'id'               => $prefix . 'block_type',
		'type'             => 'select',
		// 'show_option_none' => true,
		'default'          => 'carousel',
		'options'          => array(
			'carousel' => __( 'Carousel', 'cmb2' ),
			'banner'   => __( 'Banner', 'cmb2' ),
			'wysiwyg'  => __( 'WYSIWYG', 'cmb2' ),
		)
	) );
	
	$cmb->add_group_field( $block_group_id, array(
		'name'    => 'Carousel Title',
		// 'desc'    => 'field description (optional)',
		// 'default' => 'standard value (optional)',
		'id'      => $prefix . 'carousel_title',
		'type'    => 'text',
	) );

	$cmb->add_group_field( $block_group_id, array(
		'name'    => 'Carousel Description',
		'desc'    => 'Provide short text or call-to-action links',
		// 'default' => 'standard value (optional)',
		'id'      => $prefix . 'carousel_desc',
		'type'    => 'wysiwyg',
		'options' => array(
			'editor_class' => $prefix . 'carousel_desc_wysiwyg',
			'editor_css' => '<style> .' . $prefix . 'carousel_desc_wysiwyg { height: 200px; }</style>'
		)
	) );

	$cmb->add_group_field( $block_group_id, array(
		'name' => 'Carousel Items',
		'desc' => '',
		'id'   => $prefix . 'carousel_items',
		'type' => 'file_list',
		'preview_size' => array( 150, 150 ), // Default: array( 50, 50 )
		'query_args' => array( 'type' => 'image' ), // Only images attachment
		// Optional, override default text strings
		// 'text' => array(
		// 	'add_upload_files_text' => 'Replacement', // default: "Add or Upload Files"
		// 	'remove_image_text' => 'Replacement', // default: "Remove Image"
		// 	'file_text' => 'Replacement', // default: "File:"
		// 	'file_download_text' => 'Replacement', // default: "Download"
		// 	'remove_text' => 'Replacement', // default: "Remove"
		// ),
	) );

}