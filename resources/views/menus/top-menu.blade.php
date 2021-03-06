
        @foreach ($navItems as $navItem)
            <li class="catalogue-manager">
              <a href="{{ $navItem->getUrl() }}" title="Go to {{ $navItem->getTitle() }}">{{ $navItem->getTitle() }}@if (count($navItem->getSubItems()) > 0) <i class="fa fa-angle-down" aria-hidden="true"></i>@endif</a>

              @if (count($navItem->getSubItems()) > 0)
              <div class="drop-menu">
                <ul>
                @foreach ($navItem->getSubItems() as $subItem)
                  <li><a href="{{ $subItem->getUrl() }}" title="Go to {{ $subItem->getTitle() }}">{{ $subItem->getTitle() }}</a></li>
                @endforeach
                </ul>
              </div>
              @endif
            </li>
        @endforeach