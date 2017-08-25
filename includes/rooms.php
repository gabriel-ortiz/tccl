<?php
namespace CCL\Rooms;

/**
 * Setup actions and filters for rooms
 *
 * @return void
 */
function setup() {
	$n = function ( $function ) {
		return __NAMESPACE__ . "\\$function";
	};

	add_action( 'init', $n( 'register_rooms_post_type' ) );

	add_action( 'admin_enqueue_scripts', $n( 'load_admin_script' ), 20 );

	add_action( 'admin_menu', $n( 'import_page' ) );

	add_action( 'wp_ajax_retrieve_rooms', __NAMESPACE__ . '\\retrieve_rooms' );
	// add_action( 'wp_ajax_nopriv_retrieve_rooms', __NAMESPACE__ . '\\retrieve_rooms' );

	add_action( 'add_meta_boxes_room', $n('add_room_meta_box' ) );
}

/**
 * Register the 'room' post type using Extended CPTs
 *
 * This can be replaced with a standard post type instead of using a rary if desired
 *
 * See https://github.com/johnbillion/extended-cpts for more information
 * on registering post types with the extended-cpts rary.
 */
function register_rooms_post_type() {

	register_extended_post_type( 'room', array(
		'menu_icon' 		=> 'dashicons-clock',
		'supports'        => array( 'title' ), // content, editor, thumbnail would allow content to be edited
		'capability_type' => 'post',
		'capabilities' => array(
			'create_posts' => false, // Remove support for "Add New" (can also change to a role, rather than false)
		),
		'map_meta_cap' => true, // Allows created posts to be edited
	) );

}


/**
 * Add option page to the Rooms menu
 */
function import_page() {
	// add top level menu page
	add_submenu_page(
		'edit.php?post_type=room',
		'Room Import',
		'Import',
		'publish_posts',
		'rooms_import',
		'\CCL\Rooms\import_page_html'
	);
}

/**
 * Rooms import page callback
 */
function import_page_html() {
	// check user capabilities
	if ( ! current_user_can( 'publish_posts' ) ) {
		return;
	}

	?>
	<div class="wrap">
		<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>

		<h2>Import</h2>

		<p>Use this tool to import and update rooms from room.</p>

		<p><em>Not working</em> &mdash; the <code>process_rooms()</code> function needs to deal with
		the case of rooms coming from a group of spaces</p>

		<?php // Currently imported stats, api query for recently updated? ?>

		<div id="rooms-importer">
			<div id="rooms-info" class="hidden">

				<div class="spinner is-active" style="float:none;width:auto;height:auto;padding:10px 0 10px 40px;background-position:0;">
					Importing rooms from Springshare&hellip;
				</div>

				<div id="rooms-import-response" class="rooms-response"></div>

			</div>

			<input type="hidden" name="rooms-import-nonce" id="rooms-import-nonce" value="<?php echo wp_create_nonce( 'rooms_import_nonce' ); ?>" />

			<p class="submit">
				<input type="submit" name="rooms-import" id="rooms-import" class="button button-primary" value="Import from Springshare">
			</p>

		</div>

	</div>
	<?php
}

/**
 * Add scripts and styles for import page
 */
function load_admin_script() {
	// Enqueue Styles

	// Enqueue Scripts
	wp_enqueue_script( 'rooms', get_template_directory_uri() . '/assets/js/admin/rooms.js', 'jquery', '1.0', true );

}

/**
 * AJAX function for retrieving rooms from Springshare
 */
function retrieve_rooms() {
	check_ajax_referer( 'rooms_import_nonce', 'rooms_nonce' );

	if ( ! current_user_can( 'publish_posts' ) ) {
		wp_die( 'Error: invalid permissions' );
	}

	$rooms = process_rooms();

	$response = '<h3>Results</h3>';

	// @todo sort out actual error response here
	if ( $rooms == 'error' ) {
		$response .= '<p>Error</p>';
	} else {
		$response .= '<ul>';
		$response .= '<li><strong>Retrieved:</strong> ' . $rooms['retrieved'] . ' rooms</li>';
		$response .= '<li><strong>Imported:</strong> ' . $rooms['added'] . '</li>';
		$response .= '<li><strong>Updated:</strong> ' . $rooms['updated'] . '</li>';
		$response .= '</ul>';
	}

	wp_die( $response );
}

/**
 * Retrieve rooms, process them and return results
 *
 * @return array Data indicating success or failure of the import
 */
function process_rooms() {

	// get_space_category
	// loop through rooms provided by category
	// use get_space_item with unique id to get individual rooms

	// $rooms = \CCL\Integrations\LibCal\get_all_rooms();

	$results               = array();
	$results['retrieved']  = count( $rooms );
	$results['added']      = 0;
	$results['updated']    = 0;

	// @todo check if this is a Rooms array or an error object

	// Events are stored as an indexed array under Event
	foreach ( $rooms as $room ) {
		$add_room = add_room( $room );

		if ( 'added' == $add_room ) {
			$results['added'] = $results['added'] + 1;
		} elseif ( 'updated' == $add_room ) {
			$results['updated'] = $results['updated'] + 1;
		} else {
			//
		}
	}

	return $results;
}

/**
 * Create or update room
 *
 * @param $room
 *
 * @return string added|updated
 */
function add_room( $room ) {

	// quick and dirty way to convert multi-dimensional object to array
	$room = json_decode( json_encode( $room ), true );

	// check against custom id field to see if post already exists
	$room_id = $room['id'];

	// meta query to check if the Gid already exists
	$duplicate_check = new \WP_Query( array(
		'post_type' => 'room',
		'meta_query' => array(
			array(
				'key' => 'room_id',
				'value' => $room_id
			)
		),
	) );

	/*
		 * Construct arguments to use for wp_insert_post()
		 */
	$args = array();

	if ( $duplicate_check->have_posts() ) {

		$duplicate_check->the_post();
		$args['ID'] = get_the_ID(); // existing post ID (otherwise will insert new)

	}

	$args['post_title']   = $room['name']; // post_title
	$args['post_content'] = $room['description']; // post_content
	// $args['post_status'] = 'draft'; // default is draft
	$args['post_type']    = 'room';

	/*
	 * Create the Room and grab post id (for post meta insertion)
	 */
	$post_id = wp_insert_post( $args );

	// Insert data into custom fields
	add_post_meta( $post_id, 'room_id', $room['id'], true);

	// Raw data for development
	add_post_meta( $post_id, 'room_raw_data', $room, true);

	// @todo use this for subject?
	// Set category in XX taxonomy and create if it doesn't exist
	// $category = $room['category'];
	// wp_set_object_terms( $room_id, $category, 'XX' );

	if ( $duplicate_check->have_posts() ) {
		return "added";
	} else {
		return "updated";
	}
}


/**
 * Create a metabox to display data retrieved from the API
 *
 * @param $post
 */
function add_room_meta_box( $post ) {
	add_meta_box(
		'api_data_meta_box',
		__( 'Data from LibGuides' ),
		__NAMESPACE__ . '\\render_room_data_metabox',
		'room',
		'normal',
		'high'
	);
}

/**
 * Render the API data metabox
 */
function render_room_data_metabox() {
	global $post;

	$raw_data = get_post_meta( $post->ID, 'room_raw_data', true );

	$content = $post->post_content;

	echo '<p>';

	echo '<strong>Room ID:</strong> ' . get_post_meta( $post->ID, 'room_id', true ) . '<br>';

	echo '</p>';

	if ( $content ) {
		echo '<h4>Content</h4>';
		echo apply_filters( 'the_content', $content );
	}

	// Raw Data
	echo '<hr>';

	echo '<strong>Raw Data</strong> (<span id="raw-data-toggle" style="color:#21759B;cursor:pointer">show</span>)';

	echo '<div id="raw-api-data" class="hidden">';

	echo '<div style="white-space:pre-wrap;font-family:monospace;">';
	print_r( $raw_data );
	echo '</pre>';

	echo '</div>';
}