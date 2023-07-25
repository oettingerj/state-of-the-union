<nord-layout>
	<nord-navigation slot="nav">
		<a href="/home" slot="header" class="flex items-center gap-3 px-3">
			<img
				slot="start"
				class="h-8 object-contain"
				src="/images/nicki-flag.jpg"
				alt="nicki minaj flag"
			/>
			<h3 class="text-lg font-medium">State of the Union</h3>
		</a>
		<nord-nav-item active icon="interface-home">Home</nord-nav-item>
		<nord-dropdown expand slot="footer">
			<nord-button slot="toggle" expand>
				<nord-avatar slot="start" name="Ronald McDonald" />
				Ronald McDonald
			</nord-button>
			<nord-dropdown-item>
				Sign out
				<nord-icon slot="end" name="interface-logout" />
			</nord-dropdown-item>
		</nord-dropdown>
	</nord-navigation>
	<slot />
</nord-layout>
